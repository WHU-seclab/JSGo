## Usages:
The project contains three main parts:
1. **Profile**, see [src/profile](https://github.com/WHU-seclab/JSGo/blob/main/src/profile/readme.md)
2. **Replay**, see [src/replay](https://github.com/WHU-seclab/JSGo/blob/main/src/replay/readme.md)
3. **Mutate**, see [src/mutate](https://github.com/WHU-seclab/JSGo/blob/main/src/mutate/readme.md)

Additionally, we provide an example usage in each phase. The example demonstrates triggering a prototype pollution vulnerability in parse-server. Users can test other applications following the provided documents and examples.

We have modified prototypes:
- **jsgo-restler-fuzzer**
- **jsgo-expoSE**

You need to compile **jsgo-restler-fuzzer** as its binary isn't uploaded to the repository due to its large file size.

## Study Results:
We list our study results in Section 2 of `study.xlsx`.

## Docker Image:
```docker pull chluo/jsgo:v1```

JSGo is under ```/pppj``` folder. You do not need to install any dependencies for JSGo as we have installed it in Docker. However, if you want to test more applications, you need to install them.
