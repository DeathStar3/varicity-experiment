if not exist "resources\NUL" mkdir resources
if not exist "generated_visualizations\NUL" mkdir generated_visualizations

for /f "usebackq tokens=*" %%a in (`git rev-parse --short=0 HEAD`) do @set symfinder_version=%%a

docker run -it -v $(pwd)/resources:/resources -v $(pwd)/d3:/d3 -v $(pwd)/generated_visualizations:/generated_visualizations --user 1000:1000 -e SYMFINDER_VERSION=symfinder_version --rm symfinder-sources_fetcher
