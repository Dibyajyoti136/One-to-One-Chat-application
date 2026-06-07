package com.example.WebSocket_One_to_One_Chat_App.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.WebSocket_One_to_One_Chat_App.Entity.Status;
import com.example.WebSocket_One_to_One_Chat_App.Entity.User;
import com.example.WebSocket_One_to_One_Chat_App.Repository.UserRepoSitory;


@Service
public class UserService {
	
	private UserRepoSitory userRepo;
	
	public void saveUser(User user) {
		
		user.setStatus(Status.ONLINE);
		
		userRepo.save(user);
		
		
	}
	
	public void disconnect(User user) {
		
		var storedUser=userRepo.findById(user.getNickName()).orElse(null);
		
		if(storedUser!=null) {
			storedUser.setStatus(Status.OFFLINE);
			userRepo.save(storedUser);
		}
		
		
		
	}
	
	public List<User> findallConnected(){
		return userRepo.findAllByStatus(Status.ONLINE);
	}
}


