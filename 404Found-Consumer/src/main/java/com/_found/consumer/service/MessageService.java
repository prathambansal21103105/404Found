package com._found.consumer.service;

import com._found.consumer.model.RMQMessage;
import com._found.consumer.repo.LogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private LogRepo logRepo;

    public Iterable<RMQMessage> fetchAllMessages() {
//        Pageable pageable = PageRequest.of(1, 300);
        Sort sort = Sort.by(Sort.Direction.DESC, "timestamp");
        Iterable<RMQMessage> messagesPage = logRepo.findAll(sort);
        return messagesPage;
    }

    public List<RMQMessage> fetchMessagesByHostName(String hostName) {
        System.out.println("hostname:" + hostName);
        List<RMQMessage> messages = logRepo.findByHostName(hostName);
        Collections.reverse(messages);
        System.out.println("messages:" + messages.toString());
        return messages;
    }

    public List<RMQMessage> getMessagesByTimestampRange(String startDate, String endDate) {
//        System.out.println("startDate:" + startDate + " endDate:" + endDate);
            List<RMQMessage> messages = logRepo.findByTimeRange(startDate, endDate);
            Collections.reverse(messages);
//            System.out.println("messages:" + messages.toString());
            return messages;
    }

    public List<RMQMessage> getExactMatch(String exactMatch) {
        List<RMQMessage> messages = logRepo.findByExactMessage(exactMatch);
        Collections.reverse(messages);
        return messages;
    }
}
