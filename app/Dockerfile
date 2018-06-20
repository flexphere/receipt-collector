FROM markadams/chromium-xvfb-js

RUN apt-get update
RUN apt-get install unzip

WORKDIR /noto
ADD https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip /noto 
RUN unzip NotoSansCJKjp-hinted.zip && \
    mkdir -p /usr/share/fonts/noto && \
    cp *.otf /usr/share/fonts/noto && \
    chmod 644 -R /usr/share/fonts/noto/ && \
    fc-cache -fv
RUN rm -rf /noto

WORKDIR /app

COPY ./src .

RUN npm install

CMD ["npm", "start"]