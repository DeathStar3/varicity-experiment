if not exist "resources\NUL" mkdir resources
if not exist "generated_visualizations\NUL" mkdir generated_visualizations

for /f "usebackq tokens=*" %%a in (`git rev-parse --verify HEAD`) do @set symfinder_version=%%a

docker run -it -v %cd%\resources:/resources -v %cd%\d3:/d3 -v %cd%\generated_visualizations:/generated_visualizations --user 1000:1000 -e SYMFINDER_VERSION=symfinder_version --rm symfinder-sources_fetcher
