package com.example.WebSocket_One_to_One_Chat_App.Service;


import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.WebSocket_One_to_One_Chat_App.Entity.ChatRoom;
import com.example.WebSocket_One_to_One_Chat_App.Repository.ChatRoomRepository;
import com.example.WebSocket_One_to_One_Chat_App.Repository.UserRepoSitory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final  UserRepoSitory userRepoSitory;
	
	public ChatRoomRepository ChatroomRepo;

 
	
	public Optional<String> getChatroom(
							String senderId,
							String recipientId,
							boolean createNewRoomIfNotExist){
		
		return ChatRoomRepository.findBySenderIdAndRecipientId(senderId,recipientId)
				.map(ChatRoom::getChatId)
				.or(()->{
					if(createNewRoomIfNotExist) {
						var chatId=createChat(senderId,recipientId);
						return Optional.of(chatId);
					}
					return Optional.empty();
				});
		
	}
	
	 
private String createChat(String senderId, String recipientId) {
	// TODO Auto-generated method stub
	var chatId=String.format("%s__%s", senderId,recipientId);
	
	ChatRoom senderRecipient=ChatRoom.builder()
			.chatId(chatId)
			.senderId(senderId)
			.recipientId(recipientId)
			.build();
	
	ChatRoom recipientSender=ChatRoom.builder()
			.chatId(chatId)
			.senderId(senderId)
			.recipientId(recipientId)
			.build();
	ChatroomRepo.save(senderRecipient);
	ChatroomRepo.save(recipientSender);
	
	return chatId;
			
}
	
}
