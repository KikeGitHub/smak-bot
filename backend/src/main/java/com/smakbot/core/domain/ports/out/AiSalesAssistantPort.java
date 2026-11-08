package com.smakbot.core.domain.ports.out;

import com.smakbot.core.domain.model.ChatSession;
import com.smakbot.core.domain.model.CheckoutStep;
import com.smakbot.core.domain.model.IncomingMessage;
import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.model.Tenant;

import java.util.List;

/**
 * Puerto de salida para el motor conversacional de IA (OpenAI gpt-4o-mini).
 * Evalúa el historial de la sesión, el catálogo real, el scope del tenant y el estado del pedido.
 */
public interface AiSalesAssistantPort {

    record RuleContext(String name, String category, String response) {}

    record CampaignContext(String platform, String url, String headline, String sku) {}

    record DraftUpdate(
            String productSku,
            Integer quantity,
            String customerName,
            String deliveryAddress,
            Boolean agencyPickup,
            String customerPhone,
            Boolean requiresInvoice,
            String rtn,
            String businessName
    ) {}

    record AssistantDecision(
            String replyText,
            CheckoutStep nextStep,
            String selectedSku,
            boolean sendProductPhotos,
            boolean cancelCheckout,
            boolean confirmOrderNow,
            DraftUpdate draftUpdate
    ) {}

    AssistantDecision generateReply(
            Tenant tenant,
            List<Product> catalog,
            List<RuleContext> rules,
            List<CampaignContext> campaigns,
            List<Order> customerOrders,
            ChatSession session,
            IncomingMessage incomingMessage
    );
}

