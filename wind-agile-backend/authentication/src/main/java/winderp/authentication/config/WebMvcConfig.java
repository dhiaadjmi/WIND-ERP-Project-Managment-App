package winderp.authentication.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = "/Users/macbook/IdeaProjects/micro-services-windErp/authentication/src/main/resources/images/";
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + absolutePath);
    }
}