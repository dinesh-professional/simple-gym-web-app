import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        coaches: 'coaches.html',
        community: 'community.html',
        join: 'join.html',
        locations: 'locations.html',
        schedule: 'schedule.html',
        contact: 'contact.html',
        services: 'services.html'
      }
    }
  }
});
