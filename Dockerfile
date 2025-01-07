FROM nginx:stable-alpine

# Copy files
COPY index_hosted.html /usr/share/nginx/html/index.html
COPY js/ /usr/share/nginx/html/js/
COPY css/ /usr/share/nginx/html/css/

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]