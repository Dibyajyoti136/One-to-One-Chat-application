package com.example.WebSocket_One_to_One_Chat_App.Entity;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatMessage {

	private String id;
	private String chatId;
	private String senderId;
	private String recipientId;
	private String content;
	private Date  timestamp;
}
