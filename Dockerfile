FROM markadams/chromium-xvfb-js

ENV TZ Asia/Tokyo

RUN apt-get update
RUN apt-get install unzip

WORKDIR /noto
ADD https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip /noto 
RUN unzip NotoSansCJKjp-hinted.zip && \
    mkdir -p /usr/share/fonts/noto && \
    cp *.otf /usr/share/fonts/noto && \
    chmod 644 -R /usr/share/fonts/noto/ && \
    rm -rf /noto && \
    rm -rf /usr/share/fonts/truetype/dejavu && \
    rm -rf /usr/share/fonts/truetype/liberation && \
    fc-cache -fv

WORKDIR /app
COPY ./src .
RUN mkdir /rc && \
    npm install

CMD ["npm", "start"]