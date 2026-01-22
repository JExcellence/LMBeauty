package de.jexcellence.lmbeauty.config;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.*;

@Configuration
public class AsyncConfig {

    @Value("${app.thread-pool.core-size:10}")
    private int corePoolSize;

    @Value("${app.thread-pool.max-size:50}")
    private int maxPoolSize;

    @Value("${app.thread-pool.queue-capacity:100}")
    private int queueCapacity;

    @Value("${app.thread-pool.keep-alive:60}")
    private int keepAliveSeconds;

    @Bean
    public ExecutorService executorService() {
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
            corePoolSize,
            maxPoolSize,
            keepAliveSeconds,
            TimeUnit.SECONDS,
            new LinkedBlockingQueue<>(queueCapacity),
            new CustomThreadFactory(),
            new ThreadPoolExecutor.CallerRunsPolicy()
        );
		
        executor.prestartAllCoreThreads();
        
        return executor;
    }

    /**
     * Custom thread factory for better thread naming and management
     */
    private static class CustomThreadFactory implements ThreadFactory {
        private int threadCount = 0;

        @Override
        public Thread newThread(@NonNull Runnable r) {
            Thread thread = new Thread(r);
            thread.setName("jehibernate-pool-" + (threadCount++));
            thread.setDaemon(false);
            thread.setPriority(Thread.NORM_PRIORITY);
            return thread;
        }
    }
}
