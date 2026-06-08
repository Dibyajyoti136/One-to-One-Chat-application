package com.example.WebSocket_One_to_One_Chat_App.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.WebSocket_One_to_One_Chat_App.Entity.ChatMessage;
import com.example.WebSocket_One_to_One_Chat_App.Entity.ChatNotification;
import com.example.WebSocket_One_to_One_Chat_App.Service.ChatMessageService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
	private final SimpMessagingTemplate simpmessage;
	private final ChatMessageService chatmessageservice;

	@MessageMapping("/chat")
	public void processmessage(@Payload ChatMessage chatmessage ) {
		
		ChatMessage savemessage=chatmessageservice.save(chatmessage); 
		simpmessage.convertAndSendToUser(chatmessage.getRecipientId(), "/queue/message", ChatNotification.builder().id(savemessage.getId()).senderId(savemessage.getSenderId()).recipientId(savemessage.getRecipientId()).content(savemessage.getContent()).build());
	}
	
	@GetMapping("/messages/{senderId}/{recipientId}")
	public ResponseEntity<List<ChatMessage>> findChatMessage(
			@PathVariable("senderId") String senderId,
			@PathVariable("recipientId") String recipientId
			)
	{
		return ResponseEntity.ok(chatmessageservice.getChatMessages(senderId, recipientId));
	}
	
}
