FROM nginx:stable-alpine

# Copy the HTML file
COPY index_hosted.html /usr/share/nginx/html/index.html

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Use the default nginx command
CMD ["nginx", "-g", "daemon off;"]