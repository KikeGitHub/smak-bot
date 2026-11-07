# Etapa 1: Compilación con Maven y JDK 17
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Descargar dependencias primero para aprovechar caché de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y empaquetar el JAR ejecutable
COPY src ./src
RUN mvn clean package -DskipTests -B

# Etapa 2: Ejecución ligera con JRE 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

