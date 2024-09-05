
# JSGo Concolic Execution Tool

This is a repository for the concolic execution tool that **JSGo** uses. It is mainly based on [PPAEG](https://github.com/jackfromeast/PPAEG.git), but it has been additionally modified as described in section 4.3.3. Specifically, the concolic execution tool will only explore one path.

## Toy Example

As a toy example, you can run:

```bash
./expoSE+ infoflow.js
```

Then, check the results in `./log/xxx.json` (you can find the output file name by searching for "Writing output to" in the output of `./expoSE+ infoflow.js`). The results contain symbolic constraints for conditions along one program path.

