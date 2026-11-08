package com.smakbot.core.infrastructure.adapter.in.web;

import com.smakbot.core.infrastructure.persistence.entity.BotRuleEntity;
import com.smakbot.core.infrastructure.persistence.entity.CampaignEntity;
import com.smakbot.core.infrastructure.persistence.entity.SynonymEntity;
import com.smakbot.core.infrastructure.persistence.entity.TenantEntity;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataBotRuleRepository;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataCampaignRepository;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataSynonymRepository;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataTenantRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Knowledge & Campaigns", description = "Gestión de reglas conversacionales, sinónimos, campañas y scope multitenant para el panel SaaS")
public class AdminKnowledgeController {

    private final SpringDataBotRuleRepository ruleRepository;
    private final SpringDataSynonymRepository synonymRepository;
    private final SpringDataCampaignRepository campaignRepository;
    private final SpringDataTenantRepository tenantRepository;

    public AdminKnowledgeController(SpringDataBotRuleRepository ruleRepository,
                                    SpringDataSynonymRepository synonymRepository,
                                    SpringDataCampaignRepository campaignRepository,
                                    SpringDataTenantRepository tenantRepository) {
        this.ruleRepository = ruleRepository;
        this.synonymRepository = synonymRepository;
        this.campaignRepository = campaignRepository;
        this.tenantRepository = tenantRepository;
    }

    // ==========================================
    // TENANT SCOPE (/api/v1/admin/tenant-config)
    // ==========================================
    @GetMapping("/tenant-config")
    @Operation(summary = "Obtener configuración de giro de negocio y scope del tenant")
    public ResponseEntity<TenantEntity> getTenantConfig(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        return tenantRepository.findById(tenantId)
                .or(() -> tenantRepository.findById("smak"))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/tenant-config")
    @Operation(summary = "Actualizar giro de negocio, persona del bot y políticas de alcance (scope) del tenant")
    public ResponseEntity<TenantEntity> updateTenantConfig(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @RequestBody TenantEntity payload) {
        TenantEntity entity = tenantRepository.findById(tenantId).orElseGet(() -> {
            TenantEntity t = new TenantEntity();
            t.setId(tenantId);
            return t;
        });
        if (payload.getName() != null) entity.setName(payload.getName());
        if (payload.getCountry() != null) entity.setCountry(payload.getCountry());
        if (payload.getCurrency() != null) entity.setCurrency(payload.getCurrency());
        if (payload.getPhoneContact() != null) entity.setPhoneContact(payload.getPhoneContact());
        if (payload.getBusinessType() != null) entity.setBusinessType(payload.getBusinessType());
        if (payload.getBotPersona() != null) entity.setBotPersona(payload.getBotPersona());
        if (payload.getScopePolicy() != null) entity.setScopePolicy(payload.getScopePolicy());
        if (payload.getOrderPrefix() != null) entity.setOrderPrefix(payload.getOrderPrefix());
        return ResponseEntity.ok(tenantRepository.save(entity));
    }

    // ==========================================
    // RULES (/api/v1/admin/rules)
    // ==========================================
    @GetMapping("/rules")
    @Operation(summary = "Listar reglas conversacionales del tenant")
    public ResponseEntity<List<BotRuleEntity>> listRules(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        List<BotRuleEntity> rules = ruleRepository.findByTenantIdOrderByCreatedAtAsc(tenantId);
        if (rules.isEmpty() && !"smak".equalsIgnoreCase(tenantId)) {
            rules = ruleRepository.findByTenantIdOrderByCreatedAtAsc("smak");
        }
        return ResponseEntity.ok(rules);
    }

    @PostMapping("/rules")
    @Operation(summary = "Crear o actualizar regla conversacional")
    public ResponseEntity<BotRuleEntity> saveRule(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @RequestBody BotRuleEntity payload) {
        if (payload.getId() == null || payload.getId().isBlank()) {
            payload.setId("rule-" + UUID.randomUUID().toString().substring(0, 8));
        }
        payload.setTenantId(tenantId);
        if (payload.getEnabled() == null) {
            payload.setEnabled(true);
        }
        if (payload.getTrainingPhrases() == null) {
            payload.setTrainingPhrases(new ArrayList<>());
        }
        BotRuleEntity saved = ruleRepository.save(payload);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/rules/{id}/toggle")
    @Operation(summary = "Alternar estado activo/inactivo de una regla")
    public ResponseEntity<Void> toggleRule(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        ruleRepository.findById(id).ifPresent(rule -> {
            rule.setEnabled(!Boolean.TRUE.equals(rule.getEnabled()));
            ruleRepository.save(rule);
        });
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/rules/{id}")
    @Operation(summary = "Eliminar regla conversacional")
    public ResponseEntity<Void> deleteRule(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        if (ruleRepository.existsById(id)) {
            ruleRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // SYNONYMS (/api/v1/admin/synonyms)
    // ==========================================
    @GetMapping("/synonyms")
    @Operation(summary = "Obtener diccionario de sinónimos del tenant")
    public ResponseEntity<Map<String, List<String>>> getSynonyms(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        List<SynonymEntity> list = synonymRepository.findByTenantIdOrderByConceptAsc(tenantId);
        if (list.isEmpty() && !"smak".equalsIgnoreCase(tenantId)) {
            list = synonymRepository.findByTenantIdOrderByConceptAsc("smak");
        }
        Map<String, List<String>> map = new LinkedHashMap<>();
        for (SynonymEntity item : list) {
            map.put(item.getConcept(), item.getWords() != null ? item.getWords() : List.of());
        }
        return ResponseEntity.ok(map);
    }

    public static class SynonymGroupRequest {
        private String concept;
        private List<String> words;

        public String getConcept() { return concept; }
        public void setConcept(String concept) { this.concept = concept; }
        public List<String> getWords() { return words; }
        public void setWords(List<String> words) { this.words = words; }
    }

    @PostMapping("/synonyms")
    @Operation(summary = "Guardar o actualizar grupo de sinónimos")
    public ResponseEntity<Void> saveSynonymGroup(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @RequestBody SynonymGroupRequest req) {
        if (req.getConcept() == null || req.getConcept().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        String cleanConcept = req.getConcept().trim().toLowerCase();
        SynonymEntity entity = synonymRepository
                .findByTenantIdAndConceptIgnoreCase(tenantId, cleanConcept)
                .orElseGet(() -> {
                    SynonymEntity n = new SynonymEntity();
                    n.setTenantId(tenantId);
                    n.setConcept(cleanConcept);
                    return n;
                });
        entity.setWords(req.getWords() != null ? req.getWords() : List.of());
        synonymRepository.save(entity);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/synonyms/{concept}")
    @Operation(summary = "Eliminar grupo de sinónimos")
    public ResponseEntity<Void> deleteSynonymGroup(
            @PathVariable("concept") String concept,
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        synonymRepository.deleteByTenantIdAndConceptIgnoreCase(tenantId, concept);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // CAMPAIGNS (/api/v1/admin/campaigns)
    // ==========================================
    @GetMapping("/campaigns")
    @Operation(summary = "Listar campañas de redes sociales del tenant")
    public ResponseEntity<List<CampaignEntity>> listCampaigns(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        List<CampaignEntity> list = campaignRepository.findByTenantIdOrderByCreatedAtAsc(tenantId);
        if (list.isEmpty() && !"smak".equalsIgnoreCase(tenantId)) {
            list = campaignRepository.findByTenantIdOrderByCreatedAtAsc("smak");
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/campaigns")
    @Operation(summary = "Crear o actualizar campaña de redes sociales")
    public ResponseEntity<CampaignEntity> saveCampaign(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId,
            @RequestBody CampaignEntity payload) {
        if (payload.getId() == null || payload.getId().isBlank()) {
            payload.setId("camp-" + UUID.randomUUID().toString().substring(0, 8));
        }
        payload.setTenantId(tenantId);
        CampaignEntity saved = campaignRepository.save(payload);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/campaigns/{id}")
    @Operation(summary = "Eliminar campaña de redes sociales")
    public ResponseEntity<Void> deleteCampaign(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "tenant-hn-muebles") String tenantId) {
        if (campaignRepository.existsById(id)) {
            campaignRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }
}

