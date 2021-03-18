set -e
set -x
set -o pipefail
export SHELLOPTS

#gcmd="../..goal -d ../test/primary"

#getting transactions
#goal app call --app-id {appid} --from {ACCOUNT} --out=dumptx.dr --dryrun-dump
#goal clerk send --from={ACCOUNT} --to=“{RECEIVER}” --amount=500000 --out=statefultx.dr --dryrun-dump


goal app call --app-id 1 --from OKIPGN7D7SS6A7U5TG7ET3SI3EL6CPDTGIEEGE3PJHOVBP2WXHXYYV2AHY --out=dumptx.dr --dryrun-dump
goal clerk send --from=OKIPGN7D7SS6A7U5TG7ET3SI3EL6CPDTGIEEGE3PJHOVBP2WXHXYYV2AHY --to=“QWMVCM5IXQCIM7SETMZWV3IIW5N7GPBYAUW7GH5NVTPCUTB23I2ES5CC3M” --amount=500000 --out=statefultx.dr --dryrun-dump