package com.example.WebSocket_One_to_One_Chat_App.Entity;

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

public class ChatNotification {
	public String id;
	private String senderId;
	public String recipientId;
	private String content;
}
