package com.example.WebSocket_One_to_One_Chat_App.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document
public class User {
public String NickName;
public String fullname;
public Status status;
}
