package com.example.WebSocket_One_to_One_Chat_App.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.WebSocket_One_to_One_Chat_App.Entity.ChatMessage;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

	List<ChatMessage> findAllByChatId(String chatId);

}
