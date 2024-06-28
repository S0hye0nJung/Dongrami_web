package com.lec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@EnableJpaRepositories(basePackages = "com.lec.repository")
public class DongramiWithoutSecurityApplication {

	public static void main(String[] args) {
		SpringApplication.run(DongramiWithoutSecurityApplication.class, args);
	}

}
