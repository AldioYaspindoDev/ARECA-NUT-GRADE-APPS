const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withGradleWrapper(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const filePath = path.join(config.modRequest.platformProjectRoot, 'gradle/wrapper/gradle-wrapper.properties');
      if (fs.existsSync(filePath)) {
        let contents = fs.readFileSync(filePath, 'utf-8');
        // downgrade gradle to 8.13 to avoid Java 21 / Semeru / AGP 8.8 incompatibilities with Gradle 9, but satisfy RN 0.86 minimum
        contents = contents.replace(
          /gradle-.*-bin\.zip/,
          'gradle-8.13-bin.zip'
        );
        fs.writeFileSync(filePath, contents);
      }
      return config;
    },
  ]);
};
