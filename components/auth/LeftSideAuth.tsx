import Image from 'next/image'
import React from 'react'

const LeftSideAuth = () => {
    return (
        <div className="relative hidden lg:flex items-center justify-center border overflow-hidden">

            {/* <img
          src="/preview.png"
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        /> */}

            {/* Overlay content */}
            {/* <div className="relative z-10  px-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            Manage your store, track orders, and grow your business all in one place.
          </p>
        </div> */}

            <div className="absolute top-6 left-6 hidden lg:flex items-center gap-2 font-semibold">
                <Image
                    src="/logoPNG.png"
                    alt="Preview"
                    width={400}
                    height={400}
                />

            </div>

            <div className="absolute bottom-0 p-6 ">
                <p className="">
                    Dalabzone is a modern e-commerce platform dedicated to delivering a seamless and reliable online
                    shopping experience. The platform offers a wide variety of products including electronics,
                    fashion, furniture, vehicles, and accessories, serving individuals and businesses across Somalia and beyond.
                </p>
            </div>
        </div>
    )
}

export default LeftSideAuth