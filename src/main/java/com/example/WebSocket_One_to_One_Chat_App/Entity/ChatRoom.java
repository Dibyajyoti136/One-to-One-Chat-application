package com.example.WebSocket_One_to_One_Chat_App.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document
public class ChatRoom {

	
	@Id
	private String id;
	private String chatId;
	private String senderId;
	private String recipientId;
	
	
	
}
