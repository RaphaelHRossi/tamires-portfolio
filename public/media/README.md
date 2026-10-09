# Mídia do site

Coloque aqui as imagens e vídeos, uma pasta por projeto (use o `slug` do projeto):

```
public/media/
  kv-turma-da-monica-baby/
    capa.jpg
    render-01.jpg
  project-03/
    reel.mp4
    reel-poster.jpg
```

No `src/data/projects.ts`, referencie com caminho começando em `/media/...`:

```ts
{ kind: 'image', src: '/media/project-03/render-01.jpg', alt: 'Descrição', ratio: '16/9' }
```
