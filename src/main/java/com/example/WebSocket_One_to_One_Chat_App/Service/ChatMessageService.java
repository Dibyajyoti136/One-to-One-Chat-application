package com.example.WebSocket_One_to_One_Chat_App.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.WebSocket_One_to_One_Chat_App.Entity.ChatMessage;
import com.example.WebSocket_One_to_One_Chat_App.Repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

	private final ChatMessageRepository ChatMessageRepo;
	private final ChatRoomService chatRoomService;
	
	public ChatMessage save(ChatMessage ChatMessage) {
		var chatId= chatRoomService.getChatroom(ChatMessage.getSenderId(),ChatMessage.getRecipientId(),true).orElseThrow();
		ChatMessage.setChatId(chatId);
		return ChatMessageRepo.save(ChatMessage);
				
	}
	
	
	public List<ChatMessage> getChatMessages(
			String senderId,
			String recipientId
			)
	{
		var ChatId=chatRoomService.getChatroom(senderId, recipientId, false);
		
		return ChatId.map(ChatMessageRepo::findAllByChatId).orElse(new ArrayList<>());
	}
	
	
}
