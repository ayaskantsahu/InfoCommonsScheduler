module.exports = {
    deleteNode : function(root, target){
        var queue = [];
        queue.push(root);
        while(queue.length > 0)
        {
            var parent = queue.shift();
            if (typeof parent === "object") {
                for(child in parent)
                {
                    if (child === target) {
                        delete parent[child];
                    }
                    else
                    {
                        queue.push(parent[child]);
                    }
                }
            }
        }
    },
    
    extractNode : function(root, target){
        var queue = [];
        queue.push(root);
        while(queue.length > 0)
        {
            var parent = queue.shift();
            if (typeof parent === "object") {
                for(child in parent)
                {
                    if (child === target) {
                        return parent[child];
                    }
                    else
                    {
                        queue.push(parent[child]);
                    }
                }
            }
        }
        return root;
    },
    
    renameNode : function(root, target, newName){
        var queue = [];
        queue.push(root);
        while(queue.length > 0)
        {
            var parent = queue.shift();
            if (typeof parent === "object") {
                for(child in parent)
                {
                    if (child === target) {
                        parent[newName] = parent[child];
                        delete parent[child];
                    }
                    else
                    {
                        queue.push(parent[child]);
                    }
                }
            }
        }
    }
}