#!/bin/bash
# Bash script to quickly test backend API

echo "🧪 Testing Backend API..."
echo ""

# Test health
echo "1. Health Check:"
curl -s http://localhost:3001/health | python3 -m json.tool
echo ""
echo ""

# Test single city
echo "2. Single City Fetch (Kathmandu):"
curl -s "http://localhost:3001/api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu" | python3 -m json.tool
echo ""
echo ""

# Test batch
echo "3. Batch Fetch (Multiple Cities):"
curl -s -X POST http://localhost:3001/api/air-quality/batch \
  -H "Content-Type: application/json" \
  -d '{
    "locations": [
      {"lat": 27.7172, "lng": 85.3240, "city": "Kathmandu"},
      {"lat": 28.2096, "lng": 83.9856, "city": "Pokhara"}
    ]
  }' | python3 -m json.tool
echo ""
echo ""

echo "✅ Tests completed!"

