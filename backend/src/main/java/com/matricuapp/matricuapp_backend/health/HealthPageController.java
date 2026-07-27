package com.matricuapp.matricuapp_backend.health;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HealthPageController {

    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @GetMapping
    public String health(Model model) {
        model.addAttribute("status", "En línea");
        model.addAttribute("timestamp", LocalDateTime.now().format(TIMESTAMP_FORMAT));
        return "health";
    }
}
