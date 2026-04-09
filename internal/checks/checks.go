package checks

import (
	"context"
	"fmt"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func RunAll() error {
	rules := clientcmd.NewDefaultClientConfigLoadingRules()
	config, err := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(rules, nil).ClientConfig()
	if err != nil { return fmt.Errorf("cannot load kubeconfig: %w", err) }
	cs, err := kubernetes.NewForConfig(config)
	if err != nil { return fmt.Errorf("cannot create k8s client: %w", err) }
	fmt.Print("  Kubernetes reachable: ")
	v, err := cs.Discovery().ServerVersion()
	if err != nil { fmt.Println("FAIL"); return err }
	fmt.Println(v.GitVersion)
	fmt.Print("  CNPG CRD installed: ")
	_, err = cs.Discovery().ServerResourcesForGroupVersion("postgresql.cnpg.io/v1")
	if err != nil { fmt.Println("FAIL"); return fmt.Errorf("CNPG operator not found") }
	fmt.Println("yes")
	fmt.Print("  RBAC permissions: ")
	_, err = cs.CoreV1().Namespaces().List(context.Background(), metav1.ListOptions{Limit: 1})
	if err != nil { fmt.Println("FAIL"); return err }
	fmt.Println("ok")
	return nil
}
