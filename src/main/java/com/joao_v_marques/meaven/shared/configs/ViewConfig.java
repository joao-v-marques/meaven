package com.joao_v_marques.meaven.shared.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ViewConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/register").setViewName("register");
        registry.addViewController("/home").setViewName("home");

        registry.addViewController("/").setViewName("index");
        registry.addViewController("/simulations").setViewName("simulacoes");
        registry.addViewController("/concepts").setViewName("conceitos");
        registry.addViewController("/investments").setViewName("investimentos");

        registry.addViewController("/simulations/house").setViewName("comprar-casa");
        registry.addViewController("/simulations/car").setViewName("comprar-carro");
        registry.addViewController("/simulations/travel").setViewName("fazer-viagem");
        registry.addViewController("/simulations/loan").setViewName("emprestimo");
        registry.addViewController("/simulations/debt").setViewName("quitar-divida");
        registry.addViewController("/simulations/business").setViewName("abrir-negocio");
    }
}
