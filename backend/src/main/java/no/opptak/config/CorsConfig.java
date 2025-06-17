package no.opptak.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Tillat både localhost og produksjonsdomener
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001", 
            "http://opptaksapp.smidigakademiet.no:3001",
            "https://opptaksapp.smidigakademiet.no",
            "http://opptaksapp.smidigakademiet.no"
        ));
        
        // Tillat alle standard HTTP-metoder
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Tillat standard headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Tillat credentials
        configuration.setAllowCredentials(true);
        
        // Cache preflight response for 1 time
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}