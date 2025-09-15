# 🌱 Carbon Watch

Carbon Watch is a lightweight browser extension that estimates the carbon footprint of your web browsing.  
It tracks the amount of data transferred on each website you visit and converts it into an estimated CO₂ emission, giving users awareness of the environmental impact of digital activity.  

---

## ✨ Features

- 📊 **Real-time estimates**: Shows CO₂ emissions for each page load.  
- 🌍 **Per-site history**: Tracks cumulative emissions per domain.  
- ⚡ **Inclusive estimates**: Provides an optional multiplier to account for servers, networks, and devices.  
- 🧹 **Clear stats control**: Users can reset their footprint data anytime.  
- 🔒 **Privacy-friendly**: All calculations happen locally in your browser. No data is sent to external servers.  

---

## 🛠️ Tech Stack

- **JavaScript (ES6)** – extension logic & popup UI  
- **Chrome Extension Manifest V3** – background service worker, permissions, storage APIs  
- **HTML / CSS** – simple popup interface  
- **Web APIs** – browser storage & request monitoring  

---

## 📐 How It Works

1. **Track Data Usage**  
   The extension listens to page loads and records the number of bytes transferred.  

2. **Convert to Energy**  
   Data is converted to energy using an industry assumption of `0.06 kWh per GB`.  

3. **Convert to CO₂**
   Bytes → GB → kWh → grams of CO₂

4. **Display Results**  
The popup shows:
- CO₂ emissions for the current page  
- Cumulative emissions for the domain  
- An inclusive estimate using a multiplier (default ×50)  

---

## 📦 Installation (Developer Mode)

1. Clone this repository:
```bash
git clone https://github.com/amna55/CarbonWatch-BrowserExtension.git
   Energy is multiplied by an average grid factor of `475 g CO₂ per kWh`.


---

https://github.com/user-attachments/assets/6d7123a9-8412-49c4-82e8-1d4c35bf48d8

