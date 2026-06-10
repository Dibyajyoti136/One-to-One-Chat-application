package com.example.WebSocket_One_to_One_Chat_App.Config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.ByteArrayMessageConverter;
import org.springframework.messaging.converter.DefaultContentTypeResolver;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.util.MimeTypeUtils;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebConfig implements WebSocketMessageBrokerConfigurer {

	
	public final ObjectMapper objectMapper;
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// TODO Auto-generated method stub
		registry.enableSimpleBroker("/user");
		registry.setApplicationDestinationPrefixes("/app");
		registry.setUserDestinationPrefix("/user");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// TODO Auto-generated method stub
	registry.addEndpoint("/Ws")
			.withSockJS();
	}

	// add config
	@Override
	public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
		// TODO Auto-generated method stub
		MappingJackson2MessageConverter converter=new MappingJackson2MessageConverter();
		converter.setObjectMapper(this.objectMapper);
		DefaultContentTypeResolver resolver=new DefaultContentTypeResolver();
		resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON);
		converter.setContentTypeResolver(resolver);
		messageConverters.add(new StringMessageConverter());
		messageConverters.add(new ByteArrayMessageConverter());
		messageConverters.add(converter);
		
		
		
	return false;
	}
	
	
	
	

}
