'use client';

import SmartiaIMG from '@/assets/img/logoSmartia.png';
import PostGenerator from '@/components/post';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
  ideia: string;
  tipo: string;
  plataforma: string;
};

interface Ideia {
  title: string;
  ideia: string;
  legenda: string;
  hashtags: string[];
}

export default function Component() {
  const [ideias, setIdeias] = useState<Ideia[] | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false); // Estado para verificar se a requisição foi completada
  const { toast } = useToast();
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      ideia: '',
      tipo: 'Formal',
      plataforma: 'Instagram',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: {
    ideia: string;
    tipo: string;
    plataforma: string;
  }) => {
    startTransition(async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/test', {
          ideia: data.ideia,
          tipo: data.tipo,
          plataforma: data.plataforma,
        });

        setIdeias(response.data);
        setIsFetched(true); // Marca como requisitado
        reset();

        toast({
          title: 'Sucesso!',
          description: 'Seus posts foram criados com sucesso',
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Erro!',
          description: 'Ocorreu um erro criar seus posts',
          variant: 'destructive',
        });

        setIsFetched(false); // Requisição não foi bem-sucedida
        //    setTimeout(() => {
        //      window.location.reload();
        //    }, 5000); // 5000 milissegundos = 5 segundosy
      }
    });
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-teal-500 to-blue-900 flex  justify-center items-center gap-1 p-4">
      {/* Seção do Formulário */}
      <div className="p-6 h-[65%]  bg-slate-900 rounded-sm flex flex-col  gap-8 shadow-xl">
        <Link href="/" className="self-start">
          <ArrowLeft />
        </Link>
        <div>
          <Image
            width={300}
            height={400}
            src={SmartiaIMG.src}
            alt="Logo Completa Smart.IA"
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-center w-full "
          >
            <label> Como vc deseja que sua postagem seja?</label>
            <Controller
              name="ideia"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Descreva sua ideia"
                  className="bg-gray-700 text-white border-gray-600"
                />
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Informal">Informal</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="plataforma"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isPending ? (
                <Loader2 className="animate-spin text-white" />
              ) : (
                <span>Enviar</span>
              )}
            </Button>
            {/* {error && <p className="text-red-500">{error}</p>} 
                         {message && <p className="text-green-500">{message}</p>}  */}
          </form>
        </div>
      </div>

      {/* Seção de Exibição de Posts */}
      <div className=" h-[70%] w-[70%] ful flex flex-col gap-4 justify-center items-center border-none ">
        {isFetched && ideias && (
          <>
            <Carousel className="w-[50%] flex items-center justify-center">
              <CarouselContent>
                {ideias.map((ideia, index) => (
                  <CarouselItem key={index}>
                    <PostGenerator
                      option={index + 1}
                      title={ideia.title}
                      idea={ideia.ideia}
                      caption={ideia.legenda}
                      hashtags={ideia.hashtags}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant={'default'} />
              <CarouselNext variant={'default'} />
            </Carousel>
          </>
        )}
      </div>
    </div>
  );
}
