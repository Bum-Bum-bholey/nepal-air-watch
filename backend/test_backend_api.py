#!/usr/bin/env python3
"""
Python test script to verify backend API endpoints are working
Run this to test if backend is fetching data correctly
"""

import requests
import json
from datetime import datetime

# Backend URL
BACKEND_URL = "http://localhost:3001"

def test_health():
    """Test health endpoint"""
    print("=" * 60)
    print("1️⃣ Testing Health Endpoint")
    print("=" * 60)
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        print("✅ Health check passed!\n")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to backend!")
        print("   Make sure backend is running on port 3001")
        print("   Run: cd backend && npm run dev\n")
        return False
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False

def test_single_city():
    """Test single city fetch"""
    print("=" * 60)
    print("2️⃣ Testing Single City Fetch (Kathmandu)")
    print("=" * 60)
    
    params = {
        "lat": 27.7172,
        "lng": 85.3240,
        "city": "Kathmandu"
    }
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/air-quality", params=params, timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success! Data received:")
            print(f"   Provider: {data.get('provider', 'N/A')}")
            print(f"   AQI: {data.get('aqi', 'N/A')}")
            print(f"   PM2.5: {data.get('pm25', 'N/A')}")
            print(f"   PM10: {data.get('pm10', 'N/A')}")
            print(f"   Temperature: {data.get('temperature', 'N/A')}°C")
            print(f"   Humidity: {data.get('humidity', 'N/A')}%")
            print(f"   Wind Speed: {data.get('windSpeed', 'N/A')} km/h")
            print("\n")
            return True
        else:
            print(f"❌ Error {response.status_code}:")
            print(f"   {response.text}\n")
            return False
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False

def test_batch_cities():
    """Test batch fetch for multiple cities"""
    print("=" * 60)
    print("3️⃣ Testing Batch Fetch (Multiple Cities)")
    print("=" * 60)
    
    locations = [
        {"lat": 27.7172, "lng": 85.3240, "city": "Kathmandu"},
        {"lat": 28.2096, "lng": 83.9856, "city": "Pokhara"},
        {"lat": 27.6588, "lng": 85.3240, "city": "Lalitpur"}
    ]
    
    payload = {"locations": locations}
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/air-quality/batch",
            json=payload,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Received data for {len(data)} cities:\n")
            
            for city, info in data.items():
                print(f"   {city}:")
                print(f"     AQI: {info.get('aqi', 'N/A')}")
                print(f"     Provider: {info.get('provider', 'N/A')}")
                print()
            return True
        else:
            print(f"❌ Error {response.status_code}:")
            print(f"   {response.text}\n")
            return False
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False

def test_error_handling():
    """Test error handling with missing parameters"""
    print("=" * 60)
    print("4️⃣ Testing Error Handling (Missing Parameters)")
    print("=" * 60)
    
    try:
        # Test without parameters
        response = requests.get(f"{BACKEND_URL}/api/air-quality", timeout=5)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Error handling works correctly!")
            print(f"   Response: {response.json()}\n")
            return True
        else:
            print(f"❌ Expected 400, got {response.status_code}\n")
            return False
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("🧪 BACKEND API TEST SUITE")
    print("=" * 60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60 + "\n")
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health()))
    results.append(("Single City Fetch", test_single_city()))
    results.append(("Batch Fetch", test_batch_cities()))
    results.append(("Error Handling", test_error_handling()))
    
    # Summary
    print("=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"   {test_name}: {status}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is working correctly!")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Check the errors above.")
    
    print("=" * 60 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

