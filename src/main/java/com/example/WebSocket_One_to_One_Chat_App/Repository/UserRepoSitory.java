package com.example.WebSocket_One_to_One_Chat_App.Repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.WebSocket_One_to_One_Chat_App.Entity.Status;
import com.example.WebSocket_One_to_One_Chat_App.Entity.User;

public interface UserRepoSitory extends MongoRepository<User, String> {

	List<User> findAllByStatus(Status online);


}
