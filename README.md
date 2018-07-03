## Usage

```
$ docker pull flexphere/receipt-collector 
$ docker run \
    -e AMZN_USER=$YOUR_ACCOUNT \
    -e AMZN_PASS=$YOUR_PASSWORD \
    -v `pwd`:/rc \
    -t flexphere/receipt-collector
```