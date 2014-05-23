
@setlocal
@set NODEVER=%1
@if "%NODEVER%" == "" ( 
  echo Must pass version
  goto :eof
)

.\0%NODEVER%\node.exe --nouse-idle-notification --expose-gc --trace_gc --trace_gc_nvp --trace_gc_verbose --trace_fragmentation  server.js 443 2>err%NODEVER%.log >log%NODEVER%.log

echo %errorlevel%
