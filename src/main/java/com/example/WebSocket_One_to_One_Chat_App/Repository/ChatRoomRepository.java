package com.example.WebSocket_One_to_One_Chat_App.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.WebSocket_One_to_One_Chat_App.Entity.ChatRoom;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {

	static Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId) {
		// TODO Auto-generated method stub
		return null;
	}

}
