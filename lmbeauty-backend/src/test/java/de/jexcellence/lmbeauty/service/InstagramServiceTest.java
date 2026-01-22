package de.jexcellence.lmbeauty.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for InstagramService filtering logic.
 */
public class InstagramServiceTest {

    private InstagramService instagramService;

    @BeforeEach
    void setUp() {
        instagramService = new InstagramService();
    }

    @Test
    void testCategorizePost_Einzeltechnik() {
        // Test 1:1 technique posts
        InstagramService.InstagramPost post1 = new InstagramService.InstagramPost(
            "1", "Beautiful 1:1 lash technique result", "IMAGE", "url", "permalink", "timestamp"
        );
        
        InstagramService.InstagramPost post2 = new InstagramService.InstagramPost(
            "2", "Amazing einzeltechnik work today", "IMAGE", "url", "permalink", "timestamp"
        );
        
        InstagramService.InstagramPost post3 = new InstagramService.InstagramPost(
            "3", "Classic wimpern extension", "IMAGE", "url", "permalink", "timestamp"
        );
        
        // Use reflection to access private method for testing
        try {
            java.lang.reflect.Method method = InstagramService.class.getDeclaredMethod("categorizePost", InstagramService.InstagramPost.class);
            method.setAccessible(true);
            
            assertEquals("einzeltechnik", method.invoke(instagramService, post1));
            assertEquals("einzeltechnik", method.invoke(instagramService, post2));
            assertEquals("einzeltechnik", method.invoke(instagramService, post3));
        } catch (Exception e) {
            fail("Failed to test categorizePost method: " + e.getMessage());
        }
    }

    @Test
    void testCategorizePost_Hybrid() {
        // Test hybrid technique posts
        InstagramService.InstagramPost post1 = new InstagramService.InstagramPost(
            "1", "Stunning hybrid lash look", "IMAGE", "url", "permalink", "timestamp"
        );
        
        InstagramService.InstagramPost post2 = new InstagramService.InstagramPost(
            "2", "Perfect hybrid technique result", "IMAGE", "url", "permalink", "timestamp"
        );
        
        // Use reflection to access private method for testing
        try {
            java.lang.reflect.Method method = InstagramService.class.getDeclaredMethod("categorizePost", InstagramService.InstagramPost.class);
            method.setAccessible(true);
            
            assertEquals("hybridtechnik", method.invoke(instagramService, post1));
            assertEquals("hybridtechnik", method.invoke(instagramService, post2));
        } catch (Exception e) {
            fail("Failed to test categorizePost method: " + e.getMessage());
        }
    }

    @Test
    void testCategorizePost_Volumen() {
        // Test volume technique posts
        InstagramService.InstagramPost post1 = new InstagramService.InstagramPost(
            "1", "Amazing volumen lashes", "IMAGE", "url", "permalink", "timestamp"
        );
        
        InstagramService.InstagramPost post2 = new InstagramService.InstagramPost(
            "2", "Beautiful whispy lash style", "IMAGE", "url", "permalink", "timestamp"
        );
        
        InstagramService.InstagramPost post3 = new InstagramService.InstagramPost(
            "3", "Anime lash look for cosplay", "IMAGE", "url", "permalink", "timestamp"
        );
        
        // Use reflection to access private method for testing
        try {
            java.lang.reflect.Method method = InstagramService.class.getDeclaredMethod("categorizePost", InstagramService.InstagramPost.class);
            method.setAccessible(true);
            
            assertEquals("volumentechnik", method.invoke(instagramService, post1));
            assertEquals("volumentechnik", method.invoke(instagramService, post2));
            assertEquals("volumentechnik", method.invoke(instagramService, post3));
        } catch (Exception e) {
            fail("Failed to test categorizePost method: " + e.getMessage());
        }
    }

    @Test
    void testCategorizePost_ExclusiveFiltering() {
        // Test that posts with multiple keywords are categorized correctly
        
        // This should be volumen (not einzeltechnik) because it has volumen keyword
        InstagramService.InstagramPost post1 = new InstagramService.InstagramPost(
            "1", "1:1 technique with volumen effect", "IMAGE", "url", "permalink", "timestamp"
        );
        
        // This should be volumen (not hybrid) because it has whispy keyword
        InstagramService.InstagramPost post2 = new InstagramService.InstagramPost(
            "2", "Hybrid style with whispy effect", "IMAGE", "url", "permalink", "timestamp"
        );
        
        // This should be einzeltechnik because it only has 1:1 and no volumen/hybrid keywords
        InstagramService.InstagramPost post3 = new InstagramService.InstagramPost(
            "3", "Pure 1:1 technique application", "IMAGE", "url", "permalink", "timestamp"
        );
        
        // Use reflection to access private method for testing
        try {
            java.lang.reflect.Method method = InstagramService.class.getDeclaredMethod("categorizePost", InstagramService.InstagramPost.class);
            method.setAccessible(true);
            
            assertEquals("volumentechnik", method.invoke(instagramService, post1));
            assertEquals("volumentechnik", method.invoke(instagramService, post2));
            assertEquals("einzeltechnik", method.invoke(instagramService, post3));
        } catch (Exception e) {
            fail("Failed to test categorizePost method: " + e.getMessage());
        }
    }
}