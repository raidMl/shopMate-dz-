const fs = require('fs');
const path = require('path');

/**
 * Recursively copies a directory
 * @param {string} src Source directory path
 * @param {string} dest Destination directory path
 * @param {Array<string>} exclude List of file/folder names to exclude
 */
const copyDir = (src, dest, exclude = []) => {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        if (exclude.includes(entry.name)) continue;

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath, exclude);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

/**
 * Generates a client folder for a specific admin
 * @param {string} adminSlug A unique identifier for the admin (e.g., store-name or email prefix)
 * @param {string} adminEmail Optional email to inject
 * @param {string} adminPassword Optional password to inject
 * @param {Object} siteConfig Optional site configuration data to inject
 * @returns {string} The path to the newly created client folder
 */
const generateAdminClientFolder = (adminSlug, adminEmail = '', adminPassword = '', siteConfig = null) => {
    try {
        // Base paths
        const rootDir = path.resolve(__dirname, '..', '..', '..');
        const templatePath = path.resolve(rootDir, 'client');
        const storesFolderPath = path.resolve(rootDir, 'stores');
        const adminFolderPath = path.resolve(storesFolderPath, adminSlug);

        // 1. Create 'stores' directory if it doesn't exist
        if (!fs.existsSync(storesFolderPath)) {
            fs.mkdirSync(storesFolderPath, { recursive: true });
        }

        // 2. Check if admin folder already exists
        if (fs.existsSync(adminFolderPath)) {
            console.warn(`⚠️ Folder for admin "${adminSlug}" already exists at ${adminFolderPath}`);
            // If it exists, we still update the config if provided
            if (siteConfig) {
                const configPath = path.join(adminFolderPath, 'js', 'config.json');
                const jsDir = path.dirname(configPath);
                if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });
                fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2));
                console.log(`📡 Site configuration updated for ${adminSlug}`);
            }
            return adminFolderPath;
        }

        // 3. Copy template 'client' folder to 'stores/adminSlug'
        // Optimize: Exclude admin-specific setup files from the store folder
        const excludeList = ['createAdmin.html', 'SetupInfoGen.html', 'test-api.html', 'todo.txt', '.gitignore', 'google-sheets-setup.md', 'README.md'];
        
        console.log(`📂 Generating website for ${adminSlug}...`);
        
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template directory not found at ${templatePath}`);
        }

        copyDir(templatePath, adminFolderPath, excludeList);

        // 4. Inject Credentials file
        if (adminEmail && adminPassword) {
            const credentialsPath = path.join(adminFolderPath, 'js', 'credentials.json');
            const credentialsData = {
                email: adminEmail,
                password: adminPassword,
                adminId: siteConfig?.adminId || siteConfig?.admin || '', // Include adminId for data filtering
                generatedAt: new Date().toISOString()
            };
            
            const jsDir = path.dirname(credentialsPath);
            if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });
            
            fs.writeFileSync(credentialsPath, JSON.stringify(credentialsData, null, 2));
            console.log(`🔑 Credentials saved to ${credentialsPath}`);
        }

        // 5. Inject Site Configuration
        if (siteConfig) {
            const configPath = path.join(adminFolderPath, 'js', 'config.json');
            const jsDir = path.dirname(configPath);
            if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });
            
            fs.writeFileSync(configPath, JSON.stringify(siteConfig, null, 2));
            console.log(`📡 Site configuration injected for ${adminSlug}`);
        }

        console.log(`✅ Website generated successfully at ${adminFolderPath}`);
        return adminFolderPath;
    } catch (error) {
        console.error('❌ Error generating admin client folder:', error);
        throw error;
    }
};

module.exports = {
    generateAdminClientFolder
};
