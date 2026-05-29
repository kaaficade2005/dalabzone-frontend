import React from 'react'

const Loading = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground text-sm">
                    Loading content...
                </p>
            </div>
        </div>
    )
}

export default Loading