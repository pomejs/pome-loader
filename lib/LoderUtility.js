/**
 * Created by frank on 16-11-2.
 */
const fs = require('fs');
const path = require('path');

class LoaderUtility
{
    static LoadFile(fp, context)
    {
        const m = LoaderUtility.RequireUncached(fp);
        if(!m) return;
        let factoryInstance = null;
        if(typeof m === 'function')
        {
            // if the module provides a factory function
            // then invoke it to get a instance
            try
            {
                factoryInstance = m(context);
            }
            catch (err)
            {
                factoryInstance = new m(context);
                const proto = Object.getPrototypeOf(factoryInstance);
                const servicePrototypes =  Object.getOwnPropertyNames(proto);
                for(var value of servicePrototypes)
                {
                    if(value != "constructor")
                    {
                        factoryInstance[value] = proto[value];
                    }
                }
            }
        }
        return factoryInstance;
    }

    static RequireUncached(module)
    {
        delete require.cache[require.resolve(module)]
        return require(module)
    }

    static LoadPath(path, context)
    {
        const files = fs.readdirSync(path);
        if(files.length === 0)
        {
            console.warn('path is empty, path:' + path);
            return;
        }

        if(path.charAt(path.length - 1) !== '/')
        {
            path += '/';
        }

        let fp, fn, m, res = {};
        for(let i=0, l=files.length; i<l; i++)
        {
            fn = files[i];
            fp = path + fn;

            if(!LoaderUtility.IsFile(fp) || !LoaderUtility.CheckFileType(fn, '.js')) {
                // only load js file type
                continue;
            }

            m = LoaderUtility.LoadFile(fp, context);

            if(!m) {
                continue;
            }

            var name = m.name || LoaderUtility.GetFileName(fn, '.js'.length);
            res[name] = m;
        }

        return res;
    }

    /**
     * Check file suffix

     * @param fn {String} file name
     * @param suffix {String} suffix string, such as .js, etc.
     */
    static CheckFileType(fn, suffix)
    {
        if(suffix.charAt(0) !== '.')
        {
            suffix = '.' + suffix;
        }

        if(fn.length <= suffix.length)
        {
            return false;
        }

        const str = fn.substring(fn.length - suffix.length).toLowerCase();
        suffix = suffix.toLowerCase();
        return str === suffix;
    }

    static IsFile(path)
    {
        return fs.statSync(path).isFile();
    }

    static IsDir(path)
    {
        return fs.statSync(path).isDirectory();
    }

    static GetFileName(fp, suffixLength)
    {
        const fn = path.basename(fp);
        if(fn.length > suffixLength)
        {
            return fn.substring(0, fn.length - suffixLength);
        }
        return fn;
    }
}

module.exports = LoaderUtility;