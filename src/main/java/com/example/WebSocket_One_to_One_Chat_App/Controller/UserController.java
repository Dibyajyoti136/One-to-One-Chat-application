package com.example.WebSocket_One_to_One_Chat_App.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.WebSocket_One_to_One_Chat_App.Entity.User;
import com.example.WebSocket_One_to_One_Chat_App.Service.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class UserController {

	private final UserService Userservice;
	
	
	@MessageMapping("/user.addUser")
	@SendTo("/user/topic")
	public User addUser(@Payload User user) {
		Userservice.saveUser(user);
		return user;
	}
	
	@MessageMapping("/user.disconnectedUser")
	@SendTo("/user/topic")
	public User disconnect(@Payload User user)
	{	
		
		Userservice.disconnect(user);
		
		return user;
	}
	
	@GetMapping("/users")
	public ResponseEntity<List<User>> findConnectedUsers(){
		return ResponseEntity.ok(Userservice.findallConnected());
	}
	
	
}
