ng build --configuration production --base-href "https://aleandropresta.github.io/geo-quiz/"
if [ $? -ne 0 ]; then
  echo "[DEPLOY] Build failed."
  exit 1
fi
echo "[DEPLOY] Build completed."

# Ensure the browser directory exists before moving files
if [ -d "dist/geo-quiz/browser" ]; then
  mv dist/geo-quiz/browser/* dist/geo-quiz
  echo "[DEPLOY] Files moved from browser to dist/geo-quiz."

  # Remove the browser folder
  rm -r dist/geo-quiz/browser
  echo "[DEPLOY] Browser folder removed."
else
  echo "[DEPLOY] Browser folder does not exist. Skipping file move."
fi

npx angular-cli-ghpages --dir=dist/geo-quiz
if [ $? -ne 0 ]; then
  echo "[DEPLOY] Deployment failed."
  exit 1
fi
echo "[DEPLOY] Deployed to GitHub Pages."