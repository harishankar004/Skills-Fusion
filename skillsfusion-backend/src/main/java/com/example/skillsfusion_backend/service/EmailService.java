package com.example.skillsfusion_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("skillsfusion01@gmail.com"); // your app email
        message.setTo(to);
        message.setReplyTo("no-reply@skillsfusion.com");
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
