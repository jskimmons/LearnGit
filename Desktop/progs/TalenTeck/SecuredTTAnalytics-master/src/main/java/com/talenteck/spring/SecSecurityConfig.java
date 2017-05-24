package com.talenteck.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.dao.ReflectionSaltSource;
import org.springframework.security.authentication.dao.SaltSource;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
@EnableWebSecurity
@Configuration
@ComponentScan(basePackages = { "com.talenteck.security" })
public class SecSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationSuccessHandler myAuthenticationSuccessHandler;
  
  
    public SecSecurityConfig() {
        super();
    }

    @Override
    protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProvider());
    }

    @Override
    public void configure(final WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers("/resources/**");
        }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/j_spring_security_check*","/login*", "/logout*", "/signin/**", "/signup/**",
                        "/user/registration*", "/regitrationConfirm*", "/expiredAccount*", "/registration*",
                        "/badUser*", "/user/resendRegistrationToken*" ,"/forgotPassword*", "/user/resetPassword*",
                        "/user/changePassword*","/emailError*", "/resources/**","/old/user/registration*","/successRegister*",
                        "/resendLink*","/user/resendLink*","/admin/webusers*","/admin/index*").permitAll()
                .antMatchers("/invalidSession*").anonymous()
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login.html")
                .loginProcessingUrl("/j_spring_security_check")
                .defaultSuccessUrl("/homepage.html")
                .failureUrl("/login.html?error=true")
                .successHandler(myAuthenticationSuccessHandler)
                .usernameParameter("j_username")
                .passwordParameter("j_password")
            .permitAll()
                .and()
            .sessionManagement()
                //.invalidSessionUrl("/invalidSession.html")
                .invalidSessionUrl("/login.html?errorMsg=SessionTimeOut")
                .sessionFixation().none()
            .and()
            .logout()
                .invalidateHttpSession(true)
                .logoutUrl("/j_spring_security_logout")
                //.logoutSuccessUrl("https://www.talenteck.com")
                //.logoutSuccessHandler(myLogoutSuccessHandler)
                .logoutSuccessUrl("https://www.talenteck.com/")
                .deleteCookies("JSESSIONID")
                .permitAll();
    }

    @Bean
    public DaoAuthenticationProvider authProvider() throws Exception {
        final DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(encoder());
        authProvider.setSaltSource(saltSource());
        return authProvider;
    }

    @Bean
    public ShaPasswordEncoder encoder() {
        return new ShaPasswordEncoder(256);
    }
    
    @Bean
    public SaltSource saltSource() throws Exception {      
        ReflectionSaltSource saltSource = new ReflectionSaltSource();
        saltSource.setUserPropertyToUse("username");
        saltSource.afterPropertiesSet();
        return saltSource;
    }

}