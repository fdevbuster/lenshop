"use client";

import { BonsaiSmartPost } from "@/components/bonsai-smart-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check, ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dropzone } from "@/components/dropable-file";
import { useIpfs } from "@/lib/ipfs";
import { PINATA_GATEWAY } from "@/config/pinata";
import { StepNum, validateMeme } from "@/lib/validation/create-meme";
import { useCreateNftMint } from "@/lib/bonsai";
import { useAccount, useWalletClient } from 'wagmi';
//import { ConnectButton, useActiveAccount } from "thirdweb/react";

interface CreateMemeModalProps {
  onClose: () => void;
}

export function CreateMemeModal({ onClose }: CreateMemeModalProps) {
  const [step, setStep] = useState<StepNum>(StepNum.Details);
  const [file, setFile] = useState<File>()
  const [memeData, setMemeData] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
    initialPrice: 0.001,
    slope: 0.1,
    cid: '',
    fileId: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast();
  const ipfs = useIpfs()
  const { address: wagmiAccountAddress } = useAccount();
  const { data: wagmiWalletClient } = useWalletClient();

  // Moved publishToLens function before useCreateNftMint to resolve reference error
  const publishToLens = (mintTxHash?: string) => {
    const postDescription = mintTxHash 
      ? `${memeData.description}\n\nMinted NFT: ${mintTxHash}`
      : memeData.description;

    ipfs.publishImage({
      title: memeData.name,
      fileName: file?.name || 'meme.png',
      url: memeData.imageUrl,
      description: postDescription,
    }).then((res)=>{
      console.log('Lens Post Result', res)
      toast({
        title: "Meme Published to Lens!", 
        description: "Your meme has been successfully published.",
      });
      onClose();
    }).catch((error)=>{
      console.error('Error publishing meme to Lens', error)
      toast({
        title: "Error Publishing to Lens",   
        description: "" + error,
        variant: "destructive",
      });
    }).finally(()=>{
      setIsPublishing(false); 
    });
  }

  const {
    createNft,
    isLoading: isMintingNft,
    error: nftMintError,
    isSuccess: isNftMintSuccess,
    transactionHash: nftTransactionHash,
  } = useCreateNftMint({
    onSuccess: (result) => {
      toast({
        title: "NFT Minted Successfully!",
        description: `Transaction: ${result.transactionHash}`,
      });
      // Now proceed to publish to Lens
      publishToLens(result.transactionHash); 
    },
    onError: (error) => {
      toast({
        title: "NFT Minting Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
      setIsPublishing(false); // Reset publishing state
    },
  });

  //const activeAccount = useActiveAccount()

  // const sendTr = useRegisterContract({ 
  //   name: memeData.name, description: memeData.description, image: memeData.imageUrl
  // }, (ev)=>{
  //   console.log('SuccessOp', ev)
  //   toast({
  //     title: "Meme published!",
  //     description: "Your meme has been successfully published to Lens.",
  //   });
  // })
  const handleImageUpload = async () => {
    setIsUploading(true);
    if(file){
      const { cid, id:fileId } = await ipfs.uploadFile(file, {
        name: memeData.name,
        symbol: memeData.symbol, 
        description: memeData.description,
        slope: '0',
        initialValue: '0'
      })
      const url = `https://${PINATA_GATEWAY}/ipfs/${cid}`
      setMemeData({
        ...memeData, imageUrl: url, cid, fileId
      })

      setTimeout(()=>{
        console.log('Meme data', memeData)
      })
    }
    setIsUploading(false)
    // // Simulate upload
    // setTimeout(() => {
    //   setMemeData({
    //     ...memeData,
    //     imageUrl: "/funny-meme.png",
    //   });
    //   setIsUploading(false);
    // }, 1500);

  };

  const handlePublish = async () => { 
    if (!wagmiAccountAddress || !wagmiWalletClient) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }
    // Optional: Add Lens login check here if desired

    setIsPublishing(true); // This state now means "minting and/or publishing"
    
    const nftToMintData = {
      name: memeData.name,
      description: memeData.description,
      image: memeData.imageUrl, // Ensure this is the final IPFS URL for the image metadata
    };

    await createNft(nftToMintData);
    // The rest (publishing to Lens) is handled by the onSuccess callback of useCreateNftMint
  };

    // setTimeout(() => {
    //   toast({
    //     title: "Meme published!",
    //     description: "Your meme has been successfully published to Lens.",
    //   });
    //   setIsPublishing(false);
    //   onClose();
    // }, 2000);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const validation = validateMeme(step, {
    ...memeData, 
    file
  })

  useEffect(()=>{
    if(step == StepNum.Review){
        // ipfs.updateFile(memeData.fileId, { slope: memeData.slope+'', initialValue: memeData.initialPrice+'' })
        //   .then(res=>console.log(res))
    }
  },[step])

  const imageURL = useMemo(()=>{
    if(file){
      try{
        const objectURL = URL.createObjectURL(file);
        return objectURL
      }catch{
        return ''
      }
    }
    return ''
    
  },[file])
  const stepContent = () => {
    switch (step) {
      case StepNum.Details:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Create Your Meme Token</h2>
            <p className="text-muted-foreground">
              Enter the details for your tokenized meme
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Meme Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Pepe Deluxe"
                  value={memeData.name}
                  onChange={(e) =>
                    setMemeData({ ...memeData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., PEPE"
                  value={memeData.symbol}
                  onChange={(e) =>
                    setMemeData({ ...memeData, symbol: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your meme..."
                  className="resize-none"
                  value={memeData.description}
                  onChange={(e) =>
                    setMemeData({ ...memeData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button disabled={!validation?.valid} onClick={() => setStep(2)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case StepNum.UploadFile:

       
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upload Meme Media</h2>
            <p className="text-muted-foreground">
              Upload your meme image or GIF
            </p>

            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              {memeData.imageUrl ? (
                <div className="relative w-full aspect-square max-w-xs mx-auto">
                  <img
                    src={memeData.imageUrl || "/placeholder.svg"}
                    alt="Meme preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    onClick={() => setMemeData({ ...memeData, imageUrl: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Dropzone onSetFile={(ev:File)=>setFile(ev)}>
                  <div className="mx-auto bg-muted rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                    { !file && <ImageIcon className="h-6 w-6 text-muted-foreground" /> }
                    { !!file && <img src={imageURL} className="h-6 w-6 text-muted-foreground" /> }
                  </div>
                  
                    <h3 className="font-medium mb-1">
                      Drag and drop or click to upload
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports JPG, PNG and GIF
                    </p>
                  </Dropzone>
                  
                  <Button
                    variant="outline"
                    onClick={handleImageUpload}
                    disabled={isUploading || !file || !ipfs.canUpload}
                  >
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Media
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button  onClick={() => setStep(3)}  disabled={!validation?.valid} >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case StepNum.BondigCurve:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Configure Bonding Curve</h2>
            <p className="text-muted-foreground">
              Set the parameters for your meme's bonding curve
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="initial-price">Initial Price (ETH)</Label>
                  <span className="text-sm font-medium">
                    {memeData.initialPrice.toFixed(4)} ETH
                  </span>
                </div>
                <Slider
                  id="initial-price"
                  min={0.0001}
                  max={0.01}
                  step={0.0001}
                  value={[memeData.initialPrice]}
                  onValueChange={(value) =>
                    setMemeData({ ...memeData, initialPrice: value[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="slope">Curve Steepness</Label>
                  <span className="text-sm font-medium">
                    {memeData.slope.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="slope"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={[memeData.slope]}
                  onValueChange={(value) =>
                    setMemeData({ ...memeData, slope: value[0] })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Higher steepness means price increases faster as more tokens
                  are collected
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Price Simulation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>First collect:</span>
                    <span className="font-medium">
                      {memeData.initialPrice.toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>After 10 collects:</span>
                    <span className="font-medium">
                      {(memeData.initialPrice + memeData.slope * 10).toFixed(4)}{" "}
                      ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>After 100 collects:</span>
                    <span className="font-medium">
                      {(memeData.initialPrice + memeData.slope * 100).toFixed(
                        4
                      )}{" "}
                      ETH
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)}  disabled={!validation?.valid} >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case StepNum.Review:
        return (
          <div className="space-y-4 flex flex-col items-stretch">
            <h2 className="text-xl font-bold">Preview & Publish</h2>
            <p className="text-muted-foreground">
              Review your meme before publishing to Lens
            </p>

            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="smart-post">Smart Post</TabsTrigger>
              </TabsList>
              <TabsContent
                value="preview"
                className="p-4 border rounded-lg mt-2 h-[60vh] max-h-[350px] md:max-h-fit overflow-auto"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <img
                      src={
                        memeData.imageUrl ||
                        "/placeholder.svg?height=300&width=300&query=meme%20preview"
                      }
                      alt="Meme preview"
                      className="w-full aspect-square object-contain rounded-lg border"
                    />
                  </div>
                  <div className="w-full sm:w-1/2 space-y-2">
                    <h3 className="font-bold text-lg">
                      {memeData.name || "Meme Name"}
                    </h3>
                    <p className="text-sm font-medium">
                      ${memeData.symbol || "SYMBOL"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {memeData.description || "No description provided"}
                    </p>
                    <div className="pt-2">
                      <p className="text-sm font-medium">Initial Price:</p>
                      <p className="text-lg font-bold">
                        {memeData.initialPrice.toFixed(4)} ETH
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="smart-post"
                className="p-4 border rounded-lg mt-2 h-[60vh] max-h-[350px] md:max-h-fit overflow-auto"
              >
                <BonsaiSmartPost memeData={memeData} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
            
              <Button
                disabled={!validation?.valid || isPublishing || isMintingNft || !wagmiAccountAddress} 
                onClick={handlePublish}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {(isPublishing || isMintingNft) ? (
                  <>Processing...</> // Generic message for minting or publishing
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Mint & Publish
                  </>
                )}
              </Button>
              {/* <ConnectButton client={twclient} /> */}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(()=>{
    if(modalRef.current){

    }
  },[modalRef.current])

  return (
    <>
      <div
        ref={modalRef}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
    
        onClick={onClose}
      />

      <div
        className="fixed z-50 grid w-full max-w-sm md:max-w-md lg:max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg bottom-[4rem] right-0 sm:left-auto sm:right-2 lg:left-1/2 lg:right-auto max-h-screen"
       
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === step
                    ? "bg-primary"
                    : i < step
                    ? "bg-primary/60"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Step {step} of 4
          </span>
        </div>

        {stepContent()}
      </div>
    </>
  );
}
