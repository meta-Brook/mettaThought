FROM openjdk:11-jre-slim

# Install wget
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Download Blazegraph
RUN wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar -O /blazegraph.jar

# Expose port
EXPOSE 9999

# Run Blazegraph
CMD ["java", "-server", "-Xmx2g", "-Djava.awt.headless=true", "-jar", "/blazegraph.jar"]