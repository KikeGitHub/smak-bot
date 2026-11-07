# Etapa 1: Compilación con Maven y JDK 17 (RAM de build limitada para no saturar VPS compartido)
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

ENV MAVEN_OPTS="-Xmx384m -XX:+UseSerialGC"

# Descargar dependencias primero para aprovechar caché de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y empaquetar el JAR ejecutable
COPY src ./src
RUN mvn clean package -DskipTests -B

# Etapa 2: Ejecución ultra-ligera con JRE 17 (< 350 MB RAM total)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:+UseSerialGC", "-Xms128m", "-Xmx256m", "-XX:MaxMetaspaceSize=128m", "-Xss512k", "-jar", "app.jar"]
