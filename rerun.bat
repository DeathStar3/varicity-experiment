SET COMPOSE_CONVERT_WINDOWS_PATHS=1
SET SYMFINDER_UID=1000
SET SYMFINDER_GID=1000
set raw_path=%cd%
set after_slash=%raw_path:\=/%
SET PWD=%after_slash:C:=/c%

docker-compose -f runner-compose.yaml up

